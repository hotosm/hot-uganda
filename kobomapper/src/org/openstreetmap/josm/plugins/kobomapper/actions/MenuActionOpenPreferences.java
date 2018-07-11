package org.openstreetmap.josm.plugins.kobomapper.actions;

import org.openstreetmap.josm.Main;
import org.openstreetmap.josm.actions.JosmAction;
import org.openstreetmap.josm.gui.preferences.PreferenceDialog;

import java.awt.event.ActionEvent;

import static org.openstreetmap.josm.tools.I18n.marktr;
import static org.openstreetmap.josm.tools.I18n.tr;

public class MenuActionOpenPreferences extends JosmAction {
    private static final long serialVersionUID = 1L;

    public static final String NAME = marktr("Preferences");

    /**
     * Constructs a new {@code MenuActionOpenPreferences}.
     */
    public MenuActionOpenPreferences() {
        super(tr(NAME), "hot_small", tr("Open KobMapper Preferences"), null, false, "kobomapper/openpreferences", true);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        PreferenceDialog p = new PreferenceDialog(Main.parent);
        p.selectPreferencesTabByClass(KoboPreferenceSetting.class);
        p.setVisible(true);
    }
}
