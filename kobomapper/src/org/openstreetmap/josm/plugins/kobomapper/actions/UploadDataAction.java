package org.openstreetmap.josm.plugins.kobomapper.actions;

import org.openstreetmap.josm.Main;
import org.openstreetmap.josm.actions.JosmAction;
import org.openstreetmap.josm.plugins.kobomapper.utils.GeoserverApi;
import org.openstreetmap.josm.tools.GBC;
import org.openstreetmap.josm.tools.Logging;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;

import static org.openstreetmap.josm.tools.I18n.marktr;
import static org.openstreetmap.josm.tools.I18n.tr;

public class UploadDataAction extends JosmAction {

    public static final String NAME = marktr("Upload Layer");
    //MapView mv = MainApplication.getMap().mapView;



    public UploadDataAction() {
        super(tr(NAME), "save.png", tr("Upload Layer"), null, false);
    }

    @Override
    public void actionPerformed(ActionEvent arg0) {

        Logging.info("Upload layer");
        uploadActiveLayer();



    }


    public static void uploadActiveLayer() {

        String filter;
        String group;

        JLabel labelSectionNewLayer = new JLabel(tr("Upload Layer"));
        JPanel p = new JPanel(new GridBagLayout());


        p.add(labelSectionNewLayer, GBC.eol());

        JOptionPane pane = new JOptionPane(p, JOptionPane.INFORMATION_MESSAGE, JOptionPane.OK_CANCEL_OPTION, null) {
            private static final long serialVersionUID = 1L;

            @Override
            public void selectInitialValue() {
                //inputTown.requestFocusInWindow();
                //inputTown.selectAll();
            }
        };

        pane.createDialog(Main.parent, tr("Upload Layer")).setVisible(true);

        Object answer = pane.getValue();
        if (answer == null || answer == JOptionPane.UNINITIALIZED_VALUE ||
                (answer instanceof Integer && (Integer) answer != JOptionPane.OK_OPTION))
            return;
        GeoserverApi client = new GeoserverApi();

        client.uploadLayer();







    }
}
